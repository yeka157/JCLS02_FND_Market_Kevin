class Product {
    constructor(_name, _stock, _price, _category, _picture, _id, _qty) {
        this.name = _name;
        this.stock = _stock;
        this.price = _price;
        this.category = _category;
        this.picture = _picture;
        this.id = _id;
        this.qty = _qty;
    }
}

class Food extends Product {
    constructor(_name, _stock, _price, _category, _exp, _picture, _id, _qty) {
        super(_name, _stock, _price, _category, _picture, _id, _qty);
        this.exp = _exp;
    }
}

let produk = [
    new Product("Baju", 10, 15000, "General", "https://lzd-img-global.slatic.net/g/p/2f8ef9e37811c10f67c14f83eb3230b9.jpg_720x720q80.jpg_.webp", "SKU-1-629348", 0),
    new Food("Ayam", 12, 25000, "FnB", "2022-06-30", "https://www.resepistimewa.com/wp-content/uploads/cara-membuat-ayam-bakar-kecap.jpg", "SKU-2-693487", 0)
];
let lastId = 2;

let cart = [];

document.getElementById("productForm").onchange = function () {
    if (productCategory.value != "FnB") {
        document.getElementById("productExp").disabled = true;
    } else if (productCategory.value == "FnB") {
        document.getElementById("productExp").disabled = false;
    }
}

function submitDatabase() {
    let form = document.getElementById("productForm");
    lastId += 1;
    let picture = form.elements["productPreview"].value;
    let name = form.elements["productName"].value;
    let stock = form.elements["productStock"].value;
    let price = parseInt((form.elements["productPrice"].value)).toLocaleString("id");
    let category = form.elements["productCategory"].value;
    let exp = form.elements["productExp"].value;
    let randomNumber = Math.floor(100000 + Math.random() * 900000);
    let id = `SKU-${lastId}-${randomNumber}`;

    if (category == "General") {
        produk.push(new Product(name, stock, price, category, picture, id));
    } else if (category == "FnB") {
        produk.push(new Food(name, stock, price, category, exp, picture, id));
    }
}

function updateTable() {
    document.getElementById("list-Product").innerHTML = ``;
    for (let i = 0; i < produk.length; i++) {
        if (produk[i].exp) {
            document.getElementById("list-Product").innerHTML += `
            <tr>
            <form id="formNumber${i}">
            <td>${i + 1}</td>
            <td>${produk[i].id}</td>
            <td><img src="${produk[i].picture}" width = "150px";></td>
            <td id="name${i}">${produk[i].name}</td>
            <td>${produk[i].category}</td>
            <td id="stock${i}">${produk[i].stock}</td>
            <td id="price${i}">Rp. ${produk[i].price.toLocaleString("id")}</td>
            <td>${produk[i].exp}</td>
            <td id="button${i}">
            <button type="button" onclick = "editData('${produk[i].id}')">Edit</button>
            <br>
            <button type="button" onclick="deleteRow(${i})">Delete</button>
            <br>
            <button type="button" onclick = "buy('${produk[i].id}')">Buy</button>
            </td></form>
            </tr>`;
        } else {
            document.getElementById("list-Product").innerHTML += `
            <tr>
            <form id="formNumber${i}">
            <td>${i + 1}</td>
            <td>${produk[i].id}</td>
            <td><img src="${produk[i].picture}"width = "150px";></td>
            <td id="name${i}">${produk[i].name}</td>
            <td>${produk[i].category}</td>
            <td id="stock${i}">${produk[i].stock}</td>
            <td id="price${i}">Rp. ${produk[i].price.toLocaleString("id")}</td>
            <td></td>
            <td id="button${i}">
            <button type="button" onclick = "editData('${produk[i].id}')">Edit</button>
            <br>
            <button type="button" onclick="deleteRow(${i})">Delete</button>
            <br>
            <button type="button" onclick = "buy('${produk[i].id}')">Buy</button>
            </td></form>
            </tr>`;
        }
    }

    document.getElementById("productName").value = null;
    document.getElementById("productPreview").value = null;
    document.getElementById("productCategory").value = null;
    document.getElementById("productStock").value = null;
    document.getElementById("productPrice").value = null;
    document.getElementById("productExp").value = null;
}

function search() {
    document.getElementById("list-Product").innerHTML = "";
    let form = document.getElementById("filterForm");

    let inputObj = {};

    form.elements["filterName"].value == "" ? "" : (inputObj.name = form.elements["filterName"].value);
    form.elements["filterSKU"].value == "" ? "" : (inputObj.id = form.elements["filterSKU"].value);
    form.elements["filterCategory"].value == "" ? "" : (inputObj.category = form.elements["filterCategory"].value);
    form.elements["filterPrice"].value == "" ? "" : (inputObj.price = form.elements["filterPrice"].value);

    let inputKeys = Object.keys(inputObj);
    let inputValues = Object.values(inputObj);

    console.log(inputKeys);
    console.log(inputValues);

    let result = [];
    produk.forEach((value, index) => {
        let check = [];
        inputKeys.forEach((val, idx) => {
            if (value[inputKeys[idx]] == inputValues[idx]) {
                check.push(true);
                if (check.length == inputKeys.length) {
                    result.push(`
                
                <td>${value.id}</td>
                <td><img src="${value.picture}" width = "150px";></td>
                <td>${value.name}</td>
                <td>${value.category}</td>
                <td>${value.stock}</td>
                <td>Rp. ${value.price.toLocaleString("id")}</td>
                <td>${value.exp ? value.exp : ""}</td>
                <td>
                <button type="button" onclick= "editData('${value.id}')">Edit</button>
                <br>
                <button type="button" onclick="deleteRow(${index})">Delete</button>
                <br>
                <button type="button" onclick="buy(${value.id})">Buy</button>
                </td>
                </tr>`);
                }
            }
        });
    });

    result.forEach((value, i) => {
        document.getElementById("list-Product").innerHTML += `<tr><td>${i + 1}</td>
        ${value}`;
    });

    document.getElementById("filterName").value = null;
    document.getElementById("filterSKU").value = null;
    document.getElementById("filterCategory").value = null;
    document.getElementById("filterPrice").value = null;
}

function deleteRow(rowNumber) {
    produk.splice(rowNumber, 1);
    updateTable();
}

function editData(idEdit) {
    let index = produk.findIndex(val => val.id == `${idEdit}`);

    document.getElementById("list-Product").innerHTML = "";
    produk.forEach((val, idx) => {
        val.category == "General" ? (val.exp = "") : val.exp;
        val.exp == "" ? "-" : val.exp;

        if (idx == index) {
            document.getElementById("list-Product").innerHTML += `
            <tr>
            <td>${idx + 1}</td>
            <td>${produk[idx].id}</td>
            <td><img src="${produk[idx].picture}" width = "150px";></td>
            <td><input type="text" id="edit-name" value="${val.name}"></td>
            <td>${produk[idx].category}</td>
            <td><input type="number" id="edit-stock" value="${val.stock}"></td>
            <td><input type="number" id="edit-price" value="${val.price}"></td>
            <td>${produk[idx].exp}</td>
            <td>
            <button type="button" onclick = "save('${produk[idx].id}')">Save</button>
            <br>
            <button type="button" onclick="updateTable()">Cancel</button>
            </td>
            </tr>`
        } else {
            document.getElementById("list-Product").innerHTML += `
            <tr>
            <td>${idx + 1}</td>
            <td>${produk[idx].id}</td>
            <td><img src="${produk[idx].picture}" width = "150px";></td>
            <td>${produk[idx].name}</td>
            <td>${produk[idx].category}</td>
            <td>${produk[idx].stock}</td>
            <td>${produk[idx].price.toLocaleString("id")}</td>
            <td>${produk[idx].exp}</td>
            <td>
            <button type="button" onclick = "editData('${produk[idx].id}')">Edit</button>
            <br>
            <button type="button" onclick="Delete(${[idx]})">Delete</button>
            <br>
            <button type="button" onclick = "buy('${produk[idx].id}')">Buy</button>
            </td>
            </tr>`
        }
    });
}

function save(idEdit) {
    let index = produk.findIndex((val) => val.id == `${idEdit}`);
    let nameedit = document.getElementById("edit-name").value;
    let stockedit = document.getElementById("edit-stock").value;
    let priceedit = document.getElementById("edit-price").value;
    nameedit == "" ? "" : produk[index].name = nameedit;
    stockedit == "" ? "" : produk[index].stock = stockedit;
    priceedit == "" ? "" : produk[index].price = priceedit.toLocaleString("id");
    updateTable();
}

function buy(idEdit) {
    let index = produk.findIndex((val) => val.id == `${idEdit}`);
    produk.forEach((v, i) => {
        if (i == index) {
            if (!cart.includes(produk[i])) {
                cart.push(produk[i]);
                cart[cart.length - 1].qty += 1;
                if (produk[i].stock <= 0) {
                    alert('Stock Habis');
                } else if (cart.includes(produk[i])) {
                    produk[i].stock -= 1;
                    printCart();
                    updateTable();
                }
            } else if (cart.includes(produk[i])) {
                let nomor = cart.findIndex((val) => val.id == produk[i].id);
                cart[nomor].qty += 1;
                if (produk[i].stock <= 0) {
                    alert('Stock Habis');
                } else {
                    produk[i].stock -= 1;
                    printCart();
                    updateTable();
                }
            }
        }
    })
}

function printCart() {
    document.getElementById("cart-list").innerHTML = '';
    cart.forEach((val, idx) => {
        if (val.qty > 0) {
            let subtotal = parseInt(val.price) * parseInt(val.qty);
            document.getElementById("cart-list").innerHTML += `
        <tr>
        <td>${idx + 1}.</td>
        <td>${val.id}</td>
        <td><img src='${val.picture}' width=150px;></td>
        <td>${val.name}</td>
        <td style="width: 150px; padding: 15px 0 15px 5px;">Rp. ${val.price.toLocaleString("id")}</td>
        <td style="margin:auto; padding:30px;"><button type="button" onclick="minusStock('${val.id}')">-</button> ${val.qty} <button type="button" onclick="plusStock('${val.id}')">+</button></td>
        <td>Rp. ${subtotal.toLocaleString("id")}</td>
        <td><button type="button" onclick="deleteCart('${val.id}')">Delete</button></td>
        </tr>`
        } else {
            cart.splice[idx, 1];
        }
    })
}

function deleteCart(idEdit) {
    let index = cart.findIndex((val) => val.id == `${idEdit}`);
    let nomor = produk.findIndex((val) => val.id == `${idEdit}`);
    produk[nomor].stock += cart[index].qty;
    cart[index].qty = 0;
    cart.splice(index, 1);
    printCart();
    updateTable();
}

function minusStock(idEdit) {
    let index = cart.findIndex((val) => val.id == `${idEdit}`);
    let i = produk.findIndex((val) => val.id == `${idEdit}`);
    if (cart[index].qty == 1){
        produk[i].qty = 0;
        produk[i].stock += 1;
        cart.splice(index,1);
        printCart();
        updateTable();
    } else {
        cart[index].qty--;
        produk[i].stock += 1;
        printCart()
        updateTable();
    }
}

function plusStock(idEdit) {
    let index = cart.findIndex((val) => val.id == `${idEdit}`);
    let i = produk.findIndex((val) => val.id == `${idEdit}`);
    if (produk[i].stock == 0) {
        alert('Stock Habis');
    } else {
        cart[index].qty++;
        produk[i].stock -= 1;
        printCart();
        updateTable();
    }
}

function clearCart() {
    produk.forEach((val,idx) => {
        val.stock += val.qty;
        val.qty = 0;
    })
    cart = [];
    updateTable();
    document.getElementById("cart-list").innerHTML = "";
}

updateTable();
