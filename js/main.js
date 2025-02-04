let product = "Socks";



let app = new Vue({
    el: '#app',
    data: {
        product: "Носки",
        description: "Пара теплых, пушистых носков.",
        image: "./img/vmSocks-green-onWhite.jpg",
        altText: "Пара носков",
        link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
        inStock: true,
        inventory: 100,
        onSale: true
    }
})
