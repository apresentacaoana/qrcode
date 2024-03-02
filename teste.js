function random({min = 0, max = 100}) {
    const valor = Math.random() * (max - min) + min
    return Math.floor(valor)
}


console.log(random({min: 1, max: 100}))