const moment = require('moment')

  
function getPassedHours(createdAt) {
    const timestampEmMilissegundos = createdAt.seconds * 1000 +
    createdAt.nanoseconds / 1e6;

    const dataCriacao = moment(timestampEmMilissegundos);

    const horasPassadas = moment().diff(dataCriacao, 'hours');
    return horasPassadas
}


function getPassedDays(date) {
    const dataInicial = moment(date, 'DD/MM/YYYY')
    const diasPassados = moment().diff(dataInicial, 'days')
    return diasPassados
}

function getTimestamp(createdAt) {
    const timestampEmMilissegundos = createdAt.seconds * 1000 +
    createdAt.nanoseconds / 1e6;
    return timestampEmMilissegundos
}

function getMonthName(date) {
    moment.locale("pt-BR")
    const traducaoMeses = {
        "January": "janeiro",
        "February": "fevereiro",
        "March": "março",
        "April": "abril",
        "May": "maio",
        "June": "junho",
        "July": "julho",
        "August": "agosto",
        "September": "setembro",
        "October": "outubro",
        "November": "novembro",
        "December": "dezembro"
      };

    return traducaoMeses[moment(date, "DD/MM/YYYY").format("MMMM")]
}

module.exports = {getPassedHours, getMonthName, getTimestamp, getPassedDays}