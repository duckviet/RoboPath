// Khởi tạo các biến cần thiết
// Các cách di chuyển của robot. Đi chéo tương ứng với 4 cách di chuyển đầu. Đi thẳng tương ứng với 4 di chuyển sau
let moves = [
  [1, -1],
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 1],
];
// Độ dài cần để đi tương ứng với cách di chuyển của robot (VD: đi chéo  là sqrt(2)=1.41, đi thẳng là = 1)
let lengthMoves = [1.41, 1.41, 1.41, 1.41, 1, 1, 1, 1];
// Khởi tạo kích thước bảng và các giái trị đầu vào
let n = 0;
let m = 0;
let matrix = [];
let start;
let end;
let path = [];
// Có hai các để tính độ ưu tiên là dùng euclidean hoăc manhattan
let euclidean = [];
let manhattan = [];

// Hàm thêm và sort hàng đơi ưu tiên open theo thứ tự f giảm dần
function PushNSort(open, f, q) {
  open.push([f, q]);
  open.sort((a, b) => {
    return b[0] - a[0];
  });
}
// Hàm xử lí logic chính, sử dụng thuật toán A Star :))
function solve(start, end) {
  // Đường đi cuối cùng
  path = [];
  // Khởi tạo bản đồ
  Maping();

  // Hàng đợi đưa các vị trí có thể được duyệt qua được sắp xếp theo độ ưu tiên
  let open = [];

  // Mảng lưu các vị trí đã duyệt
  let close = Array(n)
    .fill(false)
    .map(() => Array(m).fill(false));

  // Mảng lưu quan hệ cha con
  let parent = Array(n)
    .fill(-1)
    .map(() => Array(m).fill([-1, -1]));

  // Mảng lưu g, f
  let g = Array(n)
    .fill(Infinity)
    .map(() => Array(m).fill(Infinity));

  let f = Array(n)
    .fill(Infinity)
    .map(() => Array(m).fill(Infinity));

  let expanded_nodes = 0; // Số bước được triển khai
  let path_length = 0; // Độ dài đường đi thực tế

  // Hàm kiểm tra đường đi có đi được không. Bao gồm bước đi tiếp theo đó có nằm trong map không.
  // Có sự ngăn cách giữa vị trí hiện tại với bước đi tiếp theo hay không.
  function checkValidMove(p, q) {
    if (
      q[0] >= 0 &&
      q[0] < n &&
      q[1] >= 0 &&
      q[1] < m &&
      matrix[q[0]][q[1]] == 0 &&
      !(matrix[q[0]][p[1]] + matrix[p[0]][q[1]] >= 1)
    ) {
      return true;
    }
    return false;
  }

  // Thêm vị trí bắt đầu vào hàng đợi
  open.push([0, start]);
  g[start[0]][start[1]] = 0;
  f[start[0]][start[1]] = g[start[0]][start[1]] + manhattan[start[0]][start[1]];

  // Bắt đầu vòng lặp chính của thuật toán A* :))
  while (open.length !== 0) {
    // Lấy vị trí p ở đầu hàng đợi open.
    let p = open.pop()[1];
    // Nếu đã duyệt qua vị trí này, bỏ qua
    if (close[p[0]][p[1]]) continue;
    close[p[0]][p[1]] = true;

    expanded_nodes++;

    // Nếu đã đến đích, kết thúc vòng lặp
    if (p[0] === end[0] && p[1] === end[1]) {
      break;
    }

    // Duyệt qua tất cả các hướng di chuyển có thể
    for (let j = 0; j < 8; j++) {
      let q = [p[0] + moves[j][0], p[1] + moves[j][1]];

      // Kiểm tra hướng di chuyển có hợp lệ không
      if (checkValidMove(p, q)) {
        let tentative_g = g[p[0]][p[1]] + lengthMoves[j];

        // Nếu đường đi mới ngắn hơn, cập nhật thông tin
        if (!close[q[0]][q[1]] && tentative_g < g[q[0]][q[1]]) {
          parent[q[0]][q[1]] = p; // Gán cha của vị trí kế tiếp là vị trí hiện tại
          g[q[0]][q[1]] = tentative_g;
          f[q[0]][q[1]] = g[q[0]][q[1]] + manhattan[q[0]][q[1]];
          // Thêm vị trí mới vào hàng đợi và sắp xếp lại
          PushNSort(open, f[q[0]][q[1]], q);
        }
      }
    }
  }

  // Kiểm tra nếu tìm thấy đường đi
  if (parent[end[0]][end[1]][0] !== -1 && parent[end[0]][end[1]][1] !== -1) {
    let cur = end;

    // Lưu đường đi từ đích đến điểm bắt đầu dựa trên mảng parent đã lưu vài path
    while (cur[0] !== start[0] || cur[1] !== start[1]) {
      path.push([cur[0], cur[1]]);
      cur = parent[cur[0]][cur[1]];
    }
    // Thêm điểm bắt đầu vào đường đi rồi đảo ngược thứ tự
    path.push(start);
    path.reverse();
    console.log("Path length: " + g[end[0]][end[1]]);
    console.log("Expanded nodes: " + expanded_nodes); // in ra số vị trí đã phát sinh
    console.log(path); // in ra đường đi
  } else {
    // Không tìm thấy đường đi
    alert("Path not found.");
    console.log("Path not found.");
    console.log("Expanded nodes: " + expanded_nodes);
  }
}
// Hàm Maping dùng để khởi tạo bảng và hiển thị nó trên giao diện
function Maping() {
  const boardContainer = document.getElementById("board");
  // Đặt kích thước cột và hàng cho bảng
  boardContainer.style.gridTemplateColumns = `repeat(${m}, 1fr)`;
  boardContainer.style.gridTemplateRows = `repeat(${n}, 1fr`;

  const html = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      // Tạo HTML cho mỗi ô trong bảng, sử dụng class để thể hiện màu sắc
      const cellContent = `<div id="box_${i}_${j}" class="${
        matrix[i][j] === 0 ? "checkboard_white" : "checkboard_black"
      }"></div>`;
      html.push(cellContent);
    }
  }
  // Đặt HTML vào bảng
  boardContainer.innerHTML = html.join("");
}

// Hàm OnCreate thực hiện khi người dùng tạo mới bảng
function OnCreate() {
  // Đọc giá trị nhập từ người dùng cho số hàng (n) và số cột (m)
  n = parseInt(document.getElementById("inputN").value);
  m = parseInt(document.getElementById("inputM").value);
  if (n > 30 || m > 30) {
    alert("Please chose 0 <= n, m <= 30!");
    n = 0;
    m = 0;
  }
  // Khởi tạo ma trận và các ma trận heuristic khác
  matrix = Array(n)
    .fill(0)
    .map(() => Array(m).fill(0));
  euclidean = Array(n)
    .fill(0)
    .map(() => Array(m).fill(0));
  manhattan = Array(n)
    .fill(0)
    .map(() => Array(m).fill(0));

  // Random giá trị 0 hoặc 1 cho mỗi ô trong ma trận
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < m; ++j) {
      matrix[i][j] = Math.floor(Math.random() * 2);
    }
  }
  // Gọi hàm Maping để cập nhật giao diện
  Maping();
}

// Hàm SubmitFunc thực hiện khi người dùng nhấn nút Find
function SubmitFunc() {
  // Hàm renderNumber hiển thị số trên đường đi và animation
  function renderNumber(index) {
    if (index >= 0 && index < path.length) {
      const cellId = document.getElementById(
        `box_${path[index][0]}_${path[index][1]}`
      );
      cellId.innerHTML = ` <i class="animate__animated animate__slideInDown knight fa-solid fa-bug "></i> `;
      setTimeout(() => {
        cellId.className = "checkboard_green";
        cellId.innerHTML = index;
        renderNumber(index + 1);
      }, 1000);
    }
  }

  // Đọc vị trí bắt đầu và kết thúc từ người dùng
  const start = [
    parseInt(document.getElementById("inputStartX").value),
    parseInt(document.getElementById("inputStartY").value),
  ];
  const end = [
    parseInt(document.getElementById("inputEndX").value),
    parseInt(document.getElementById("inputEndY").value),
  ];

  console.log(matrix);

  // Tính toán ma trận heuristic Euclidean và Manhattan
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      // Nếu vị trí là vật cản thì gán = -1
      if (matrix[i][j] === 1) {
        euclidean[i][j] = -1;
        manhattan[i][j] = -1;
      }
      // Còn không sử dụng công thức trong slice của cô
      else {
        euclidean[i][j] = Math.sqrt(
          Math.pow(end[0] - i, 2) + Math.pow(end[1] - j, 2)
        );
        manhattan[i][j] = Math.abs(end[0] - i) + Math.abs(end[1] - j);
      }
    }
  }

  // Kiểm tra điều kiện nếu start và end k trùng với vật cản trước khi gọi hàm solve
  if (matrix[start[0]][start[1]] != 1 && matrix[end[0]][end[1]] != 1) {
    solve(start, end);
    // Hiển thị số trên đường đi
    renderNumber(0);
  } else {
    alert("Don't have a solution for this position! Try again.");
  }
}
