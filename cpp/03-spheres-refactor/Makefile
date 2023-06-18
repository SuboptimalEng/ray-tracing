main: main.o
	./main.o >> image.ppm

main.o: main.cpp
	g++ -std=c++11 main.cpp -o main.o

clean:
	rm -f main.o image.ppm