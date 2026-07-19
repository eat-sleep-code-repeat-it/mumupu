export function translate(input: string): string {
  // Your translation logic goes here

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="black"/>
      <text x="50" y="100" fill="white" font-size="32">
        ${input}
      </text>
    </svg>
  `;

  return svg;
}