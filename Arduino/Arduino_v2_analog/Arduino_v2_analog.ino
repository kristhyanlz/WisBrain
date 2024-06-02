#define N_SENSORS 4

byte sensorPin[] = {A1,A2,A3,A4};
int sensorState[] = {0,0,0,0};
char sensorName[] = {'A', 'B', 'C', 'D'};

int led_rojo  = 3;
int led_verde = 2;

int led_time = 0;

bool state = false;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(led_rojo, OUTPUT);
  pinMode(led_verde, INPUT);
  //ANALOG: 0 - 1023
  //204
  
  led_time = millis();
}


void loop() {
  int time_now = millis();

  if (Serial.available() > 0){
    char msg = Serial.read();
    led_time = millis();
    switch (msg){
      case '0':
        digitalWrite(led_rojo, HIGH);
        break;
      case '1':
        digitalWrite(led_verde, HIGH);
        break;
    }
  }

  // FOR detecta tarjeta
    for (register int i = 0; i < N_SENSORS; ++i){
      int actualState = (analogRead(sensorPin[i]) > 512)? 1 : 0;
      if (sensorState[i] != actualState){
        Serial.print(sensorName[i]);
        Serial.println(actualState);

        sensorState[i] = actualState;
      }
    }

  if ( (time_now - led_time) >= 1500 ){
    digitalWrite(led_rojo,  LOW);
    digitalWrite(led_verde, LOW);
  }
  
  delay(1);
}
