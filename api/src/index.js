/**
 * Cloudflare Worker - Gemini API Proxy
 * 代理前端請求到 Gemini API，保護 API 金鑰不暴露
 */

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MODEL_ID = "gemini-3-pro-image-preview";

/**
 * 處理 CORS headers
 */
function corsHeaders(origin, allowedOrigin) {
  // 檢查來源是否允許
  const isAllowed =
    origin === allowedOrigin ||
    origin === "http://localhost:3000" ||
    origin?.startsWith("http://localhost:");

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * 處理 OPTIONS preflight 請求
 */
function handleOptions(request, env) {
  const origin = request.headers.get("Origin") || "";
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, env.ALLOWED_ORIGIN),
  });
}

/**
 * 處理生成髮型請求
 */
async function handleGenerate(request, env) {
  const origin = request.headers.get("Origin") || "";
  const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

  try {
    // 解析請求內容
    const body = await request.json();
    const { front, side, hairstyle } = body;

    // 驗證必要欄位
    if (!front || !side || !hairstyle) {
      return new Response(JSON.stringify({ error: "缺少必要的照片" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // 構建 Gemini API 請求
    const prompt = `Transfer the hairstyle from the reference image to the target person while preserving their facial identity and features. Create a photorealistic result with:
- Shadow-matched hairline
- Scalp-hugging fit that follows the head contour
- Natural face-framing that complements facial structure
- Consistent hair texture and color from reference
- Proper lighting that matches the original photo
- Show the result from both front view and side view for consistency`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: front,
              },
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: side,
              },
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: hairstyle,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    };

    // 呼叫 Gemini API
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 金鑰未設定" }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const geminiResponse = await fetch(
      `${GEMINI_API_BASE}/models/${MODEL_ID}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    // 處理 Gemini API 回應
    const geminiData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      const errorMessage = geminiData.error?.message || "生成失敗";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: geminiResponse.status,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // 回傳結果
    return new Response(JSON.stringify(geminiData), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "伺服器錯誤" }),
      {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
  }
}

/**
 * 主要請求處理
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 處理 CORS preflight
    if (request.method === "OPTIONS") {
      return handleOptions(request, env);
    }

    // 路由處理
    if (path === "/api/generate" && request.method === "POST") {
      return handleGenerate(request, env);
    }

    // 健康檢查
    if (path === "/health" || path === "/") {
      return new Response(
        JSON.stringify({ status: "ok", service: "haircut-api" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 404
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
};
