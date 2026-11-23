const KEY = "todos";
let todos = [];
let filter = "all";

try { todos = JSON.parse(localStorage.getItem(KEY)) || []; } catch { todos = []; }

const $ = (id) => document.getElementById(id);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(todos)); } catch {} };

function render() {
  const list = $("list");
  list.innerHTML = "";
  const shown = todos.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done);

  for (const t of shown) {
    const li = document.createElement("li");
    if (t.done) li.className = "done";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = t.done;
    cb.onchange = () => { t.done = cb.checked; save(); render(); };

    const span = document.createElement("span");
    span.textContent = t.text;

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "削除";
    del.onclick = () => { todos = todos.filter((x) => x.id !== t.id); save(); render(); };

    li.append(cb, span, del);
    list.append(li);
  }
  $("count").textContent = `未完了 ${todos.filter((t) => !t.done).length} 件`;
}

$("form").onsubmit = (e) => {
  e.preventDefault();
  const text = $("input").value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  $("input").value = "";
  save();
  render();
};

$("filters").onclick = (e) => {
  const f = e.target.dataset.filter;
  if (!f) return;
  filter = f;
  document.querySelectorAll("#filters button")
    .forEach((b) => b.classList.toggle("active", b.dataset.filter === f));
  render();
};

$("clear").onclick = () => { todos = todos.filter((t) => !t.done); save(); render(); };

render();
