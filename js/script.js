document.addEventListener("DOMContentLoaded", () => {
  const formInputBook = document.getElementById("inputBook");
  const checkbox = document.getElementById("sudahBaca");
  formInputBook.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (checkbox.checked) {
      inputSudahBaca();
    } else {
      inputBelumBaca();
    }
  });

  if (lokalStorage()) {
    loadDataLokalStorage();
  }
});

const objBuku = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

const STORAGE_KEY = "BOOKSHELF_APPS";
const SAVED_EVENT = new Event("simpan-data");

const lokalStorage = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

const simpanData = () => {
  if (lokalStorage()) {
    const parsed = JSON.stringify(listBuku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(SAVED_EVENT);
  }
};

const loadDataLokalStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const buku of data) {
      listBuku.push(buku);
    }
  }

  document.dispatchEvent(renderEvent);
};

const listBuku = [];
const renderEvent = new Event("render-buku");

const inputBelumBaca = () => {
  const id = +new Date();
  const title = document.getElementById("inputJudul").value;
  const author = document.getElementById("inputPenulis").value;
  const year = document.getElementById("inputTahun").value;

  const buatObjBuku = objBuku(id, title, author, parseInt(year), false);
  listBuku.push(buatObjBuku);

  document.dispatchEvent(renderEvent);
  simpanData();
};

const inputSudahBaca = () => {
  const id = +new Date();
  const title = document.getElementById("inputJudul").value;
  const author = document.getElementById("inputPenulis").value;
  const year = document.getElementById("inputTahun").value;

  const buatObjBuku = objBuku(id, title, author, parseInt(year), true);
  listBuku.push(buatObjBuku);

  document.dispatchEvent(renderEvent);
  simpanData();
};

document.addEventListener("render-buku", () => {
  const unfinishRead = document.getElementById("unfinishRead");
  unfinishRead.innerHTML = "";

  const finishRead = document.getElementById("finishRead");
  finishRead.innerHTML = "";

  for (const sebuahBuku of listBuku) {
    const elementBuku = buatBuku(sebuahBuku);
    if (!sebuahBuku.isComplete) unfinishRead.append(elementBuku);
    else finishRead.append(elementBuku);
  }
});

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

  if (objBuku.isComplete) {
    const bacaLagi = document.createElement("button");
    bacaLagi.innerText = "Baca Lagi";
    bacaLagi.classList.add("read-again-button");

    const hapusBuku = document.createElement("button");
    hapusBuku.innerText = "Hapus Buku";
    hapusBuku.classList.add("remove-button");

    bacaLagi.addEventListener("click", () => {
      bacaBukuLagi(objBuku.id);
    });

    hapusBuku.addEventListener("click", () => {
      hapusBukuDariRak(objBuku.id);
    });

    container.append(bacaLagi, hapusBuku);
  } else {
    const bacaBuku = document.createElement("button");
    bacaBuku.innerText = "Baca Buku";
    bacaBuku.classList.add("read-button");

    const hapusBuku = document.createElement("button");
    hapusBuku.innerText = "Hapus Buku";
    hapusBuku.classList.add("remove-button");

    bacaBuku.addEventListener("click", () => {
      sudahBacaBuku(objBuku.id);
    });

    hapusBuku.addEventListener("click", () => {
      hapusBukuDariRak(objBuku.id);
    });

    container.append(bacaBuku, hapusBuku);
  }

  return container;
};

const cariBuku = (objBukuID) => {
  for (const sebuahBuku of listBuku) {
    if (sebuahBuku.id === objBukuID) {
      return sebuahBuku;
    }
  }
  return null;
};

const sudahBacaBuku = (objBukuID) => {
  const targetBuku = cariBuku(objBukuID);

  if (targetBuku == null) return;

  targetBuku.isComplete = true;
  document.dispatchEvent(renderEvent);
  simpanData();
};

const bacaBukuLagi = (objBukuID) => {
  const targetBuku = cariBuku(objBukuID);

  if (targetBuku == null) return;

  targetBuku.isComplete = false;
  document.dispatchEvent(renderEvent);
  simpanData();
};

const cariIndexBuku = (objBukuID) => {
  for (const index in listBuku) {
    if (listBuku[index].id === objBukuID) {
      return index;
    }
  }

  return -1;
};

const hapusBukuDariRak = (objBukuID) => {
  const targetBuku = cariIndexBuku(objBukuID);

  if (targetBuku === -1) return;

  listBuku.splice(targetBuku, 1);
  document.dispatchEvent(renderEvent);
  simpanData();
};

const formCariBuku = document.getElementById("cariBuku");
formCariBuku.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const katakunci = document.getElementById("kataKunci").value.toLowerCase();
  cariDanTampilkanBuku(katakunci);
});

const cariDanTampilkanBuku = (katakunci) => {
  const unfinishRead = document.getElementById("unfinishRead");
  const finishRead = document.getElementById("finishRead");

  unfinishRead.innerHTML = "";
  finishRead.innerHTML = "";

  for (const sebuahBuku of listBuku) {
    const judul = sebuahBuku.title.toLowerCase();
    const penulis = sebuahBuku.author.toLowerCase();

    if (judul.includes(katakunci) || penulis.includes(katakunci)) {
      const elementBuku = buatBuku(sebuahBuku);
      if (!sebuahBuku.isComplete) unfinishRead.append(elementBuku);
      else finishRead.append(elementBuku);
    }
  }
};
