export const calculateCircleArea = (radius: number): number => {
  if (radius < 0) {
    throw new Error("Invalid radius");
  }
  return Math.PI * Math.pow(radius, 2);
};