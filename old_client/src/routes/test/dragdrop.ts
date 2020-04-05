export class DragDrop {
  allowDrop(ev) {
    console.log("dragover")
    ev.preventDefault()
    return true
  }

  drag(ev) {
    console.log("drag")
    ev.dataTransfer.setData("text", ev.target.id)
    return true
  }

  drop(ev) {
    console.log("drop")
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(data)
    // ev.target.appendChild(document.getElementById(data));
    return true
  }
}
