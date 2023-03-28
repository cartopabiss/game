interface IEnemy {
  create(): void;
  update(time: number, delta: number): void;

}
export default IEnemy;
