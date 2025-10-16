export const convertFilesToBase64 = async (
  files: File[]
): Promise<string[]> => {
  const base64Files: string[] = [];

  for (const file of files) {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    base64Files.push(base64);
  }

  return base64Files;
};
