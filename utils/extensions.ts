declare global {
  interface Date {
    toDateString(): string;
  }
}

Date.prototype.toDateString = function (): string {
  return this.toISOString().split("T")[0];
};
