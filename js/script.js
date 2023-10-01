const submitBook = document.getElementById("inputBook");
const checkBook = document.getElementById("sudahBaca");

document.addEventListener("DOMContentLoaded", () => {
  submitBook.addEventListener("submit", (ev) => {
    ev.preventDefault();
    tambahBuku();
  });
  checkBook.addEventListener("change", (ev) => {
    ev.preventDefault();
    tambahBuku();
  });
});

const storage = [];
const newEvent = new Event("new-event");

const objBuku = (id, title, author, year, isComplete) => {
  return { id, title, author, year, isComplete };
};

const tambahBuku = () => {
  const id = +new Date();
  const judul = document.getElementById("inputJudul").value;
  const penulis = document.getElementById("inputPenulis").value;
  const tahun = document.getElementById("inputTahun").value;

  const objectBuku = objBuku(id, judul, penulis, tahun, false);
  storage.push(objectBuku);
  console.log(storage);

  document.dispatchEvent(newEvent);
};

const buatBuku = (objBuku) => {
  const container = document.createElement("div");
  container.classList.add("container-book");
  const textContainer = document.createElement("div");
  const title = document.createElement("h3");
  const author = document.createElement("p");
  const year = document.createElement("p");

  title.innerText = `Judul: ${objBuku.title}`;
  author.innerText = `Penulis: ${objBuku.author}`;
  year.innerText = `Tahun: ${objBuku.year}`;

  textContainer.append(title, author, year);
  container.append(textContainer);
  container.setAttribute("id", `idbuku-${objBuku.id}`);

  const bacaBuku = document.createElement("button");
  bacaBuku.innerText = "Baca Buku";
  bacaBuku.classList.add("read-button");
  const bacaLagi = document.createElement("button");
  bacaLagi.innerText = "Baca Lagi";
  bacaLagi.classList.add("read-again-button");
  const hapusBuku = document.createElement("button");
  hapusBuku.innerText = "Hapus Buku";
  hapusBuku.classList.add("remove-button");

  if (objBuku.isCompleted === false) {
    bacaBuku.addEventListener("click", function () {
      bacaBuku(todoObject.id);
    });
    hapusBuku.addEventListener("click", function () {
      hapusBuku(todoObject.id);
    });

    container.append(bacaBuku, hapusBuku);
  } else {
    bacaLagi.addEventListener("click", function () {
      bacaLagi(todoObject.id);
    });

    hapusBuku.addEventListener("click", function () {
      hapusBuku(todoObject.id);
    });

    container.append(bacaLagi, hapusBuku);
  }

  return container;
};

document.addEventListener("new-event", () => {
  const belumBaca = document.getElementById("unfinishRead");
  belumBaca.innerHTML = "";
  const sudahBaca = document.getElementById("finishRead");
  sudahBaca.innerHTML = "";

  for (const listBuku of storage) {
    const buku = buatBuku(listBuku);
    if (checkBook.checked == true) {
      sudahBaca.append(buku);
    } else if (submitBook.onsubmit == true) {
      belumBaca.append(buku);
    }
  }
});
