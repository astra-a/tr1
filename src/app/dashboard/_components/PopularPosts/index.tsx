import Card from "@/app/dashboard/_components/Card";
import Post from "@/app/dashboard/_components/Post";
import Button from "@/app/dashboard/_components/Button";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

interface PopularPostsProps {
  title: string;
  items: {
    id: number;
    title: string;
    image: string;
    price: number;
    active: boolean;
  }[];
}

const PopularPosts = ({ title, items }: PopularPostsProps) => {
  return (
    <Card classHead="!pl-3" title={title}>
      <div className="flex flex-col gap-1">
        {items.map((post) => (
          <Post value={post} key={post.id} />
        ))}
      </div>
      <div className="pt-6 px-3 pb-3">
        <Button className="w-full" href={ROUTES.posts} as="link" isStroke>
          All posts
        </Button>
      </div>
    </Card>
  );
};

export default PopularPosts;
