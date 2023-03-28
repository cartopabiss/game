interface IMissile {
  create(): void;
  update(time: number, delta: number): void;
  removeItem(): void;
}
export default IMissile;
