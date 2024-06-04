export function onMessage(message: any, sender: any, room: any) {
  room.broadcast(message, [sender.id]);
}
