import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
    // Ensure value is a valid number between 0 and 5
    const sanitizedValue = isNaN(value) ? 0 : Math.max(0, Math.min(value, 5));

    // Calculate the number of full, half, and empty stars
    const fullStars = Math.floor(sanitizedValue);
    const halfStars = sanitizedValue - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    console.log(`Value: ${value}, Full Stars: ${fullStars}, Half Stars: ${halfStars}, Empty Stars: ${emptyStars}`);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, index) => (
                <FaStar key={index} className={`text-${color} ml-1`} />
            ))}

            {halfStars === 1 && <FaStarHalfAlt className={`text-${color} ml-1`} />}

            {[...Array(emptyStars)].map((_, index) => (
                <FaRegStar key={index} className={`text-${color} ml-1`} />
            ))}

            <span className={`rating-text ml-2 text-${color}`}>
        {text && text}
      </span>
        </div>
    );
};

Ratings.defaultProps = {
    color: "yellow-500",
};

export default Ratings;

