var searchInput = document.getElementById("searchBar")
searchInput.addEventListener("focusin",function(){
    if(searchInput.value.length===0){
        searchInput.placeholder="";
    }
})
searchInput.addEventListener("focusout",function(){
    if(searchInput.value.length===0){
        searchInput.placeholder="Wyszukaj...";
    }
})

