"use client";

import { TrackCard } from "./TrackCard";
import { category } from "@repo/store";
import { Track, Problem } from "@prisma/client";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, Button, Checkbox } from "@repo/ui";

interface TrackPros extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export const Tracks = ({ tracks }: { tracks: TrackPros[] }) => {
  const selectedCategory = useRecoilValue(category);
  const [filteredTracks, setFilteredTracks] = useState<TrackPros[]>(tracks);
  const [sortBy, setSortBy] = useState<string>("");
  const [cohort3, setCohort3] = useState<boolean>(false);

  const filterTracks = () => {
    let filteredTracks = tracks;
    if (cohort3) {
      filteredTracks = filteredTracks.filter((t) => t.cohort === 3);
    }
    if (selectedCategory.length > 0) {
      filteredTracks = filteredTracks.filter((t) => t.categories.some((c) => c.category.category === selectedCategory));
    }
    setFilteredTracks(filteredTracks);
  };
  const sortTracks = (sortBy: string) => {
    let sortedTracks = [...filteredTracks];
    if (sortBy === "ascending") {
      sortedTracks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "descending") {
      sortedTracks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "new") {
      sortedTracks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "old") {
      sortedTracks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    setFilteredTracks(sortedTracks);
  };
  useEffect(() => {
    filterTracks();
  }, [selectedCategory,cohort3]);
  useEffect(() => {
    sortTracks(sortBy);
  }, [sortBy]);
  return (
    <div>
      <div className="flex justify-evenly mt-6">
        <Select
          onValueChange={(e) => {
            setSortBy(e);
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent
            ref={(ref) => {
              if (!ref) return;
              ref.ontouchstart = (e) => {
                e.preventDefault();
              };
            }}
          >
            <SelectGroup>
              <SelectItem value="ascending">Ascending (A to Z)</SelectItem>
              <SelectItem value="descending">Descending (Z to A)</SelectItem>
              <SelectItem value="new">Newest first</SelectItem>
              <SelectItem value="old">Oldest first</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setCohort3(!cohort3)}
          variant={"outline"}
          className={cohort3 ? "bg-gray-100 dark:bg-slate-700" : ""}
        >
          Cohort 3
        </Button>
      </div>
      <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 place-items-center lg:grid-cols-2 w-full">
        {filteredTracks.map((t) => (
          <li key={t.id} className="max-w-screen-md w-full">
            <TrackCard track={t} />
          </li>
        ))}
      </ul>
    </div>
  );
};
