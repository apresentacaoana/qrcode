function calcularDistancia(lat1, lon1, lat2, lon2) {
    const raioDaTerra = 6371; // Raio médio da Terra em quilômetros
  
    // Converter graus para radianos
    const radLat1 = (Math.PI * lat1) / 180;
    const radLon1 = (Math.PI * lon1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const radLon2 = (Math.PI * lon2) / 180;
  
    // Diferença de latitude e longitude
    const difLat = radLat2 - radLat1;
    const difLon = radLon2 - radLon1;
  
    // Fórmula de Haversine para calcular a distância
    const a =
      Math.sin(difLat / 2) * Math.sin(difLat / 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(difLon / 2) * Math.sin(difLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    // Distância em quilômetros
    const distanciaKm = raioDaTerra * c;
  
    // Converter para metros
    const distanciaMetros = distanciaKm * 1000;
  
    return { km: distanciaKm, metros: distanciaMetros };
}
  

export default calcularDistancia