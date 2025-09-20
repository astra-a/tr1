import Card from "@/app/dashboard/_components/Card";
import Post from "@/app/dashboard/_components/Post";
import Button from "@/app/dashboard/_components/Button";

import { popularPosts } from "@/app/dashboard/_mocks/posts";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

const TopEarningPosts = ({}) => {
  return (
    <Card classHead="!pl-3" title="Top-earning posts">
      <div className="flex flex-col gap-1">
        {popularPosts.map((post) => (
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

export default TopEarningPosts;
