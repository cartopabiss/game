interface IBomb {
  create(): void;
  update(time: number, delta: number): void;
  removeItem(): void;
}
export default IBomb;
