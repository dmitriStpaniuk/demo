type GenerateCarProps = {
  createCar: (car: { name: string, color: string }) => void
};
export const GenerateCars = ({ createCar }: GenerateCarProps) => {
  const brends = ['John Deere', 'CNH', 'AGCO', 'Claas', 'SDF', 'Kuhn', 'Kverneland', 'Krone', 'Amazone', 'Poettinger'];
  const mopdels = ['super', ' mega', 'ogogo', 'topchek', 'cool', 'zbc', 'best', 'winner'];
  const getRandomName = () => {
    const brend = brends[Math.floor(Math.random() * brends.length)];
    const mopdel = mopdels[Math.floor(Math.random() * mopdels.length)];
    return `${brend} ${mopdel}`;//?
  };

  const num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
  const getRandomColor = () => {
    const arr = Array(6).fill(0);
    return ['#'].concat(arr.map(() => String(num[Math.floor(Math.random() * 16)]))).join('');
  };

  const generateCars = () => {
    return Array(100).fill(0).map(() => ({ name: getRandomName(), color: getRandomColor() }));
  };

  return (
    <div>
      <button onClick={() => {
        generateCars().map(i => createCar(i));
      }}>100 wheelbarrow</button>
    </div>
  );
};
