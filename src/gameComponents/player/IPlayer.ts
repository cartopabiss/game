interface IPlayer {

  update(time: number, delta: number): void;
  getBody(): Phaser.Physics.Arcade.Body;

}
export default IPlayer;
