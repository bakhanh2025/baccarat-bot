const secretKey = "superSecretKey123!";

function encryptAES(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

function decryptAES(data) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return [];
  }
}

function saveDefaultUsers() {
  localStorage.setItem("user_accounts", "U2FsdGVkX1/R2RVobHj7Rm4frMYEgxUY0jvmxy48EeDAxWSYxEjoYxLaRlJHeWmC90aA6P4JuzjnIYUZtvz2EcEIZ+yJJ4nUiWXfIj2MinS06iHCoYDJLuJlDZavjRPbLeVX6Xb+GZCdMQFoj07nEKQi/+ynDSBDDPBt0eH7SD+fkftXPNRbvcgtTAPReQ9RHe6vXHERdHMeKcM7E7+lnnzoW7PIFeTKWymw3HB8EEYOvbdnHxbt/t4sEF6WmwJSZR5+mRQbJ3ESS4Z+qjUWFEvvzgsoPlS+BsV59eE0mjU=")
}

function getUsers() {
  const data = localStorage.getItem("user_accounts");
  return data ? decryptAES(data) : [];
}

function checkLogin() {
  const user = localStorage.getItem("logged_in_user");
  if (user) {
    let html = `
        <div class="ml20 mt20 mr20">
        <div class="roadmap-container">
          <div class="roadmap" id="roadmap-result">
            <div class="header-card">
              <div class="tb-header">
                <h6>Kết quả</h6>
                <span>- Tổng số bàn: </span>
                <span class="lblTotalTable">0</span>
              </div>
              <div class="action-bnt-gr">
                <div class="del-btn-gr">
                  <button
                    class="btn btn-success btn-sm"
                    onclick="sendMessageToTelegram()"
                  >
                    <i class="bi bi-send"></i>
                    Gửi
                  </button>
                </div>
              </div>
            </div>
            <hr style="margin-top: 8px" />
            <div class="map-box2 result"></div>
          </div>
        </div>
      </div>` +
      // <div class="ml20 mt20 mr20">
      //   <div class="roadmap-container">
      //     <div class="roadmap" id="roadmap-result-by-table">
      //       <div class="header-card">
      //         <div class="tb-header">
      //           <h6>Kết quả theo bàn </h6>
      //           <span>- Tổng số bàn: </span>
      //           <span class="lblTotalTable">0</span>
      //         </div>
      //       </div>
      //       <hr style="margin-top: 8px" />
      //       <div class="map-box2 result-by-table"></div>
      //     </div>
      //   </div>
      // </div>

      `
      <div class="ml20 mt20 mr20 table-container">
        <div class="roadmap-container" id="roadmaps"></div>
      </div>

      <div class="footer">
        <button class="btn btn-danger btn-sm" id="logout-btn">Đăng xuất</button>
        <button id="delete-all" class="btn btn-danger btn-sm">
          Xóa Tất Cả
        </button>

        <div class="input-group input-group-sm add-roadmap">
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên bàn..."
            id="txtIndexTable"
          />
          <button class="btn btn-primary btn-sm" type="button" id="add-roadmap">
            Tạo
          </button>
        </div>

        <button class="btn btn-primary btn-sm" type="button" id="btnCalculate">
          <i class="bi bi-calculator-fill"></i>
        </button>
      </div>
      `;
    $("#main-container").html(html);

    init();
  }
}

$(document).on("click", "#logout-btn", () => {
  localStorage.removeItem("logged_in_user");
  let html = `
    <div class="container mt-5">
        <h2 class="mb-4">💼 Trang Quản Lý</h2>
        <div id="user-info">
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    `;
  $("#main-container").html(html);
});

$(document).ready(function () {
  $("#submit-login").click(() => {
    const username = $("#username").val().trim();
    const password = $("#password").val().trim();
    const hash = CryptoJS.SHA256(password).toString();

    const users = getUsers();
    const match = users.find(u => u.username === username && u.password === hash);

    if (match) {
      localStorage.setItem("logged_in_user", username);
      $("#login-error").text("");
      $("#loginModal").modal('hide');
      $(".modal").removeClass("show").removeAttr("style"); // fix bug backdrop
      checkLogin();
    } else {
      $("#login-error").text("Sai tên đăng nhập hoặc mật khẩu.");
    }
  });
});