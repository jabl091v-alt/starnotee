function saveNote() {
    let text = document.getElementById("note").value;

    if (text === "") {
        alert("اكتب ملاحظة أولاً!");
        return;
    }

    document.getElementById("output").innerHTML =
        "🌟 ملاحظتك: " + text;
}