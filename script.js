window.getTimer = null;
window.reloadTimer = null;

const $ = (a) => document.querySelector(a);

const Fetch = async (durakNo) => {
  const host = "https://esdyo.vercel.app/";
  const fet = await fetch(host + durakNo);
  const data = await fet.json();
  $("#loading").style.display = "none";
  return data.length ? data : false;
};

const PrintTable = (data) => {
  let content = "";
  if (data.length) {
    $("#durak-ad").innerHTML = data[0].DurakAd;
    data.forEach((r) => {
      content += `
        <tr>
          <td>${ucwords(r.OtobusAd).split(" - ").join("<br />")}</td>
          <td class="big center">${r.OtobusNo}</td>
          <td class="center">
            <div class="big">${r.Mesafe}</div>
            <div>durak kaldı</div>
          </td>
        </tr>
      `;
    });
  } else {
    $("#durak-ad").innerHTML = "";
    content += `
      <tr>
        <td colspan="3">Durağa yaklaşan otobüs bulunmamaktadır.</td>
      </tr>
    `;
  }
  $("#table-body").innerHTML = content;
};

const Get = (durakNo) => {
  $("#loading").style.display = "inline-block";
  localStorage.setItem("durakNo", durakNo);
  if (durakNo) {
    $("#card-body").style.display = "block";
    $("#card-footer").style.display = "none";
    try {
      clearTimeout(window.getTimer);
    } catch (error) {}
    window.getTimer = setTimeout(async () => {
      const data = await Fetch(durakNo);
      PrintTable(data);
    }, 1e3);
  } else {
    $("#durak-ad").innerHTML = "";
    $("#card-body").style.display = "none";
    $("#card-footer").style.display = "block";
    $("#card-footer").innerHTML = "Durak numarası giriniz!";
  }
};

const Reload = () => {
  try {
    clearTimeout(window.reloadTimer);
    Get(localStorage.getItem("durakNo"));
  } catch (error) {}
  let yenileSn = 16;
  $("#btn-yenile").innerHTML = `Yenile`;
  window.reloadTimer = setInterval(() => {
    if ($("#loading").style.display == "none") {
      $("#btn-yenile").innerHTML = `Yenile (${--yenileSn})`;
    }
    if (!yenileSn) {
      Reload();
    }
  }, 1e3);
};

const RegisterSW = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(
      "https://necdetuygur.github.io/eshot-duraga-yaklasan-otobusler/sw.js",
      {
        scope: "https://necdetuygur.github.io/eshot-duraga-yaklasan-otobusler/",
      }
    );
  }
};

function ucwords(str) {
  strVal = "";
  str = str.toLocaleLowerCase().split(" ");
  for (let chr = 0; chr < str.length; chr++) {
    strVal +=
      str[chr].substring(0, 1).toLocaleUpperCase() +
      str[chr].substring(1, str[chr].length) +
      " ";
  }
  return strVal;
}

window.addEventListener("load", () => {
  const lsDurak = localStorage.getItem("durakNo") || false;
  if (lsDurak) {
    $("#durak-no").value = lsDurak;
  } else {
    Get("");
  }
  $("#durak-no").focus();
  Reload();
  RegisterSW();
});
