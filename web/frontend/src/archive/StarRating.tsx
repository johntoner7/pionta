import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  if (rating == null || rating === 0) {
    return null;
  }

  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= rating ? (
        <StarIcon color="primary" key={i} />
      ) : (
        <StarBorderIcon color="primary" key={i} />
      )
    );
  }
  return <div>{stars}</div>;
};

export default StarRating;
