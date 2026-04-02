// Canvas 모의 구현 (테스트 환경용)

export const createCanvas = () => {
  return {
    getContext: () => ({
      createLinearGradient: () => ({
        addColorStop: () => {},
      }),
      fillStyle: "",
      fillRect: () => {},
      font: "",
      fillText: () => {},
      textAlign: "",
      measureText: () => ({ width: 100 }),
      strokeStyle: "",
      lineWidth: 0,
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
    }),
    toBuffer: () => Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"),
  };
};

export default { createCanvas };
