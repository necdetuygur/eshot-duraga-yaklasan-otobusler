window.timer = null;
const Get = (durak) => {
  localStorage.setItem("durak", durak);
  document.querySelector(
    "#table-body"
  ).innerHTML = `<tr><td colspan="3" class="text-center">...</td></tr>`;
  if (durak) {
    document.querySelector("#card-body").style.display = "block";
    document.querySelector("#card-footer").style.display = "none";
    try {
      clearTimeout(window.timer);
    } catch (error) {}
    window.timer = setTimeout(async () => {
      let content = "";
      const fet = await fetch("https://esdyo.vercel.app/" + durak);
      const data = await fet.json();
      if (data.length) {
        data.forEach((r) => {
          content += `
            <tr>
              <td>${r.ad}</td>
              <td>${r.otobus}</td>
              <td>${r.mesafe}</td>
            </tr>
          `;
        });
      } else {
        content += `
          <tr>
            <td colspan="3">Durağa yaklaşan otobüs bulunmamaktadır.</td>
          </tr>
        `;
      }
      document.querySelector("#table-body").innerHTML = content;
    }, 1e3);
  } else {
    document.querySelector("#card-body").style.display = "none";
    document.querySelector("#card-footer").style.display = "block";
    document.querySelector("#card-footer").innerHTML =
      "Durak numarası giriniz!";
  }
};

const Reload = () => {
  window.top.location.reload();
};

window.addEventListener("load", () => {
  const lsDurak = localStorage.getItem("durak") || false;
  if (lsDurak) {
    Get(lsDurak);
    document.querySelector("#durak").value = lsDurak;
    document.querySelector("#durak").focus();
  } else {
    Get("");
  }

  let yenileSn = 16;
  setInterval(() => {
    document.querySelector("#btn-yenile").innerHTML = `Yenile (${--yenileSn})`;
    if (!yenileSn) {
      Reload();
    }
  }, 1e3);
});
