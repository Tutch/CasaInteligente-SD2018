#include <DHT.h>

#define DHTTYPE DHT11
#define DHTPIN 6
#define echoPin 2
#define trigPin 3
#define TIME_TO_READ_SENSORS 5
#define READ_SENSORS_DELAY 2000

DHT dht(DHTPIN, DHTTYPE);
int LDR_Pin = A0; //analog pin 0

String messageReceived;
const String TURN_OFF = "shutdown";

unsigned long sendStart;
unsigned long loopTime;

unsigned int timesRead = 0;

// Sensor data
long duration, distance;
int LDRReading;
float temperature;
bool presence = false;

// Mediam from readings
long mediamDistance;
long mediamLDR;
float mediamTemperature;
String mediamPresence = "false";

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  dht.begin();  
}

void loop() {
  // Read data in cicles before transmitting content
  readSensors();
  
  mediamDistance += distance;
  mediamLDR += LDRReading;
  mediamTemperature += temperature;

  // If a single presence check is true, the resulting presence is true.
  if(presence == true){
    mediamPresence = "true";
  }
  
  timesRead++;

  // Calculate mediam and send data
  if(timesRead >= ((TIME_TO_READ_SENSORS/(READ_SENSORS_DELAY/1000))+1 )){
    mediamDistance /= timesRead;
    mediamLDR /= timesRead;
    mediamTemperature /= timesRead;
    
    writeSensorsToSerial();

    timesRead = 0;
    mediamDistance = 0;
    mediamLDR = 0;
    mediamTemperature = 0;
    mediamPresence = "false";
    presence = false;
  }

  sendStart = millis();

  while(loopTime < READ_SENSORS_DELAY){
    loopTime = millis() - sendStart;
  }

  loopTime = 0; 
}

// Read sensors connected to the arduino board.
void readSensors(){
  LDRReading = analogRead(LDR_Pin); 
  temperature = dht.readTemperature();
  
  if (isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = (duration/2) / 29.1;

  if(distance < 200){
    presence = true;
  }else{
    presence = false;  
  }
}

// Write the mediam of data measured by sensors to the serial port.
void writeSensorsToSerial(){
  Serial.print("{\"temperatura\":\"");
  Serial.print(mediamTemperature);
  Serial.print("\",\"luz\":");
  Serial.print(mediamLDR);
  Serial.print("\",\"pres\":");
  Serial.print(mediamPresence);
  Serial.print("\",\"proximidade\":\"");
  Serial.print(mediamDistance);
  Serial.println("\"}");
}

