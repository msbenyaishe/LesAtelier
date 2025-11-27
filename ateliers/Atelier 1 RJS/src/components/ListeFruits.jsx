export default function ListeFruits() {
    const fruits = ["Apple", "Banana", "Orange"];

    return (
        <ul>
            {
                fruits.map((fruit, index) => (
                    <li key={index}>{fruit}</li>
                ))
            }
        </ul>
    )
}