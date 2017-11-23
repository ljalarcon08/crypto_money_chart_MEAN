# crypto_money_chart_MEAN

Graficos de cambios de precios (U$) en cryptomonedas (Etherium - Bitcoin - Dash) por minuto en la ultima hora.

MEAN - Anychart - Socket.io

Debe estar instalado:

1. Node JS 8.7.0 (y su variable global)
2. MongoDB 3.4.10 (uso de puerto por defecto)

Instalación:

1. git clone https://github.com/ljalarcon08/crypto_money_chart_MEAN.git
2. Accedera a carpeta chart_crypto_money.
3. Ejecutar npm install
4. Ejecutar npm start
5. Desde navegador acceder a http://localhost:3000

Configuracion de base de datos:

chart_crypto_money/model/db.json, por defecto:

{
	"mongo":{
		"host":"localhost",
		"db":"pricesindicators"
	}
}
