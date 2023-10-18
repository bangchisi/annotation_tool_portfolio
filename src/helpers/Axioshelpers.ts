export const axiosErrorHandler = (error: unknown, message: string) => {
  if (error instanceof Error) {
    console.log(message);
    console.dir(error.stack);
  }
};
