import { ref } from "vue";
import apiClient from "@/utils/apiClient";

export const useNanoBanana = () => {
  const generating = ref(false);
  const progress = ref(0);
  const error = ref(null);
  const result = ref(null);

  /**
   * Generate hairstyle transfer
   * @param {Object} photos - Photo objects
   * @param {string} photos.front - Base64 front photo
   * @param {string} photos.side - Base64 side photo
   * @param {string} photos.hairstyle - Base64 hairstyle reference photo
   * @returns {Promise<string>} Generated image URL or base64
   */
  const generateHairstyle = async (photos) => {
    try {
      generating.value = true;
      progress.value = 0;
      error.value = null;
      result.value = null;

      const { front, side, hairstyle } = photos;

      if (!front || !side || !hairstyle) {
        throw new Error("缺少必要的照片");
      }

      progress.value = 10;

      // Construct the prompt for hairstyle transfer
      const prompt = `Transfer the hairstyle from the reference image to the target person while preserving their facial identity and features. Create a photorealistic result with:
- Shadow-matched hairline
- Scalp-hugging fit that follows the head contour
- Natural face-framing that complements facial structure
- Consistent hair texture and color from reference
- Proper lighting that matches the original photo
- Show the result from both front view and side view for consistency`;

      progress.value = 20;

      const modelId = "gemini-3-pro-image-preview";

      // Prepare request payload
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

      progress.value = 30;

      // Get API key and add as query parameter
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "未設定 API 金鑰，請在 .env.local 檔案中設定 VITE_GEMINI_API_KEY",
        );
      }

      // Make API request with API key as query parameter
      console.log("發送 API 請求到:", `/models/${modelId}:generateContent`);
      const response = await apiClient.post(
        `/models/${modelId}:generateContent?key=${apiKey}`,
        requestBody,
      );

      progress.value = 80;

      // Debug: Log full API response
      console.log("API 完整回應:", JSON.stringify(response.data, null, 2));

      // Extract generated image from response
      if (response.data?.candidates?.[0]?.content?.parts) {
        const parts = response.data.candidates[0].content.parts;
        console.log("找到的 parts:", parts);

        // Look for inline_data in response
        const imagePart = parts.find(
          (part) => part.inline_data || part.inlineData,
        );

        if (imagePart) {
          const inlineData = imagePart.inline_data || imagePart.inlineData;
          if (inlineData?.data) {
            const base64Data = inlineData.data;
            const mimeType =
              inlineData.mime_type || inlineData.mimeType || "image/png";
            result.value = `data:${mimeType};base64,${base64Data}`;
            progress.value = 100;
            console.log("成功取得圖片資料");
            return result.value;
          }
        }

        // Alternative: check for text response
        const textPart = parts.find((part) => part.text);
        if (textPart?.text) {
          console.log("API 返回文字回應:", textPart.text);

          // If API returns URL in text
          const urlMatch = textPart.text.match(/https?:\/\/[^\s]+/);
          if (urlMatch) {
            result.value = urlMatch[0];
            progress.value = 100;
            return result.value;
          }

          // If API refused or explained something
          throw new Error(`API 回應: ${textPart.text}`);
        }
      }

      // If we get here, log what we received and throw error
      console.error("未預期的 API 回應結構:", response.data);
      throw new Error("API 未返回生成的圖片。請查看 Console 了解詳細資訊。");
    } catch (err) {
      error.value = err.message || "生成髮型失敗";
      throw err;
    } finally {
      generating.value = false;
      if (!error.value) {
        progress.value = 100;
      }
    }
  };

  /**
   * Reset state
   */
  const reset = () => {
    generating.value = false;
    progress.value = 0;
    error.value = null;
    result.value = null;
  };

  return {
    generating,
    progress,
    error,
    result,
    generateHairstyle,
    reset,
  };
};
