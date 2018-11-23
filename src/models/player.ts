export default class Player {
  public id: string = "";
  public name: string = "";
  constructor(id?: string, name?: string) {
    this.id = id || (Math.random() * 1000).toString();
    this.name = name || "Pepper bot";
  }
}
