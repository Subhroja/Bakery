function fetchCategory(category)
{
    fetch("http://localhost:3000/api/category",{
        method: "POST",
        headers:{
            'content-type': 'application/json'
        },
        body: JSON.stringify({category: category})
    }).then(res => res.json()).then(data => {
        document.getElementById("result").textContent = data.message}).catch(err => console.error(err));

}