const data = (new function () {

    let id_of_student = 1;
    const array = {};
//C
    this.create = obj => { //создание id студента
    obj.Id = id_of_student++;
    array[obj.Id] = obj; //записывает инфу о новом студенте с общий список
    return obj; //возвращает obj
}
//R
    this.getAll = () => {
    return Object.values(array); //возвращаем  в базу
}

    this.get = id => array[id]; //записывавет id студента
//U
    this.update = obj => { //в obj есть id, по нему понимает, куда нужно положить новую информацию о студенте
    array[obj.Id] = obj; //находит obj
    return obj; //возвращает obj студента
}
//D
    this.delete = id => { //получает id студента, которого нужно удалить
    delete array[id];
}
});
//конец new function



for (let num = 1; num < 4; num++) {
data.create({
name: "Студент " + num
, birthday: "2002-10-2" + num
, course: "1"
, group: "ЦПИ-11"
, phone: "8(906)123-56-70" + num
,
});
}

const util = new function () {

this.parse = (tpl, obj) => { //выводим данные
let str = tpl;
for (let k in obj) { //проходимся по всем данным о студенте
str = str.replaceAll("{" + k + "}", obj[k]); //заполняем данными по очереди "имя", "др" и т.д
}
return str; //возвращаем значение
};

this.id = el => document.getElementById(el);
this.q = el => document.querySelectorAll(el);
this.listen = (el, type, callback) => el.addEventListener(type, callback);
}

const student = new function () {

this.submit = () => { //заполняет данные из заполненной формы

const st = {
name: util.id("name").value,
birthday: util.id("birthday").value,
course: util.id("course").value,
group: util.id("group").value,
phone: util.id("phone").value,
};


if(util.id("Id").value == "0"){ //проверяет, если это 0 студент
data.create(st) ;
}
else {
st.Id = util.id("Id").value; //иначе дает ему id
data.update(st);
}
this.render(); //данные на странице выводились правильно
util.id("fieldset_creation").style.display = "none";
}

this.remove = () => {
data.delete(activeStudent); //удаляет студента
this.render(); //обновляет форму, чтобы было видно удаление
util.id("fieldset_deletion").style.display = "none";
}

const init = ()=>{
this.render();

util.q("#to_close_fieldset_deletion, #kr_to_close_fieldset_deletion").forEach(el=>{ //форма хотите ли вы удалить студента
util.listen(el, "click", ()=>{
util.id("fieldset_deletion").style.display = "none"; //если нажимаем на "х" или "нет", то форма закрывается
});
});

util.q("#kr_to_close_fieldset_creation").forEach(el=>{ //форма заполения или изменения
util.listen(el, "click", ()=>{
util.id("fieldset_creation").style.display = "none"; //если нажать на "х", то форма закроется
});
});

util.id("delete_student").addEventListener("click", student.remove) //удаляет студента
util.id("submit").addEventListener("click", student.submit) //отправляет данные о студенте из заполненной формы
};

const add = () => {
util.q("#fieldset_creation .modal-title")[0].innerHTML = "Добавить сведения о новом студенте";
util.q("#form_creation")[0].reset(); //удаление прошлых данных из формы
util.id("Id").value = "0"; //присвоение id 0, чтобы потом найти свободный id
util.id("fieldset_creation").style.display = "block";
};

const edit = el => {
util.q("#fieldset_creation .modal-title")[0].innerHTML = "Изменить сведения о студенте";
util.q("#form_creation")[0].reset(); //удаление прошлых данных из формы

const st = data.get(el.dataset["id"]); //записывает id студента, чьи данные хотим изменить
for(let k in st){ //записывает данные об этом студенте
util.id(k).value = st[k];
}
util.id("fieldset_creation").style.display = "block";
};

let activeStudent = null;
const rm = el => {
util.id("fieldset_deletion").style.display = "block";
activeStudent = el.dataset["id"];
//записываем id студента, которого хотим удалить
};

const listeners = { //объявляют данные массива
edit: [],
rm: []
};

const clearListener = ()=>{
listeners.edit.forEach(el=>{
el.removeEventListener("click",edit); // при click вызывается edit (изменение сведения о студенте)
});
listeners.rm.forEach(el=>{
el.removeEventListener("click",rm); // при click вызывается rm (удаление)
});
listeners.edit = []; //очищают массив, чтобы заполнить списки по новой
listeners.rm = [];
};

const addListener = ()=>{
util.id("to_view_form_add").addEventListener("click", add); //создание кнопки "добавить"

util.q(".to_view_form_edit").forEach(el=>{ //создание кнопки "изменить"
listeners.edit.push(el);
util.listen(el, "click", ()=>edit(el));
});
util.q(".to_view_form_remove").forEach(el=>{ //создание кнопки "удалить"
listeners.rm.push(el);
util.listen(el, "click", ()=>rm(el));
});
};

this.render = () => { //записываем новые данные в таблицу
clearListener() //вызываем функцию clearListener
util.id("main_table").innerHTML = data //записываем данные из data
.getAll()
.map(el => util.parse(tpl, el)).join(""); //выводим данные
addListener(); //вызываем функцию addListener стр 147
};

const tpl = `
<tr>
<td>{Id}</td>
<td>{name}</td>
<td>{birthday}</td>
<td>{course}</td>
<td>{group}</td>
<td>{phone}</td>
<td>
<button class="to_view_form_edit" data-id="{Id}" type="button">Изменить</button>
<button class="to_view_form_remove" data-id="{Id}" type="button">Удалить</button>
</td>
</tr>
`;
//создается новый студент или перезаписание данных
window.addEventListener("load", init);
}
