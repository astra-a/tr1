import { useState } from "react";
import Card from "@/app/dashboard/_components/Card";
import Percentage from "@/app/dashboard/_components/Percentage";
import Tabs from "@/app/dashboard/_components/Tabs";

import { postActivity } from "@/app/dashboard/_mocks/posts";

const durations = [
  { id: 1, name: "Last 2 weeks" },
  { id: 2, name: "Last month" },
  { id: 3, name: "Last year" },
];

const categories = [
  { id: 1, name: "Post" },
  { id: 2, name: "Views" },
  { id: 3, name: "Likes" },
];

const PostActivity = ({}) => {
  const [duration, setDuration] = useState(durations[0]);
  const [category, setCategory] = useState(categories[0]);

  return (
    <Card
      className="col-left mb-0 max-lg:mb-3"
      title="Post activity"
      selectValue={duration}
      selectOnChange={setDuration}
      selectOptions={durations}
    >
      <Tabs
        className="hidden px-3 max-md:flex"
        classButton="flex-1"
        items={categories}
        value={category}
        setValue={setCategory}
      />
      <div className="p-5 pb-0 max-md:pt-4 max-lg:px-3">
        <div className="flex items-center gap-6 h-14 text-caption text-t-tertiary/80">
          <div className="flex-1">Week</div>
          <div
            className={`flex-1 ${
              category.id === 1 ? "max-md:block" : "max-md:hidden"
            }`}
          >
            Posts
          </div>
          <div
            className={`flex-1 ${
              category.id === 2 ? "max-md:block" : "max-md:hidden"
            }`}
          >
            Views
          </div>
          <div
            className={`flex-1 ${
              category.id === 3 ? "max-md:block" : "max-md:hidden"
            }`}
          >
            Likes
          </div>
          <div className="flex-1 max-2xl:hidden">Comments</div>
        </div>
        {postActivity.map((item) => (
          <div
            className="flex items-center gap-6 h-17 border-t border-s-subtle text-body-2 last:h-19"
            key={item.id}
          >
            <div className="flex items-center flex-1">{item.week}</div>
            <div
              className={`flex items-center gap-2 flex-1 ${
                category.id === 1 ? "max-md:flex" : "max-md:hidden"
              }`}
            >
              {item.posts.counter}
              {item.posts.percentage && (
                <Percentage value={item.posts.percentage} />
              )}
            </div>
            <div
              className={`flex items-center gap-2 flex-1 ${
                category.id === 2 ? "max-md:flex" : "max-md:hidden"
              }`}
            >
              {item.views.counter}
              {item.views.percentage && (
                <Percentage value={item.views.percentage} />
              )}
            </div>
            <div
              className={`flex items-center gap-2 flex-1 ${
                category.id === 3 ? "max-md:flex" : "max-md:hidden"
              }`}
            >
              {item.likes.counter}
              {item.likes.percentage && (
                <Percentage value={item.likes.percentage} />
              )}
            </div>
            <div className="flex items-center gap-2 flex-1 max-2xl:hidden">
              {item.comments.counter}
              {item.comments.percentage && (
                <Percentage value={item.comments.percentage} />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PostActivity;
