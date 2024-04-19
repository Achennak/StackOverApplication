import axiosInstance from "./api/axiosInstance";

const validatePassword = (password) => {
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
  const hasNumber = /[0-9]+/.test(password);
  const hasUpperCase = /[A-Z]+/.test(password);
  const hasMinimumLength = password.length >= 8;

  const errors = [];
  if (!hasSpecialChar) {
    errors.push({
      isError: true,
      message: "Password must contain at least one special character",
    });
  }
  if (!hasNumber) {
    errors.push({
      isError: true,
      message: "Password must contain at least one number.",
    });
  }
  if (!hasUpperCase) {
    errors.push({
      isError: true,
      message: "Password must contain at least one uppercase letter.",
    });
  }
  if (!hasMinimumLength) {
    errors.push({
      isError: true,
      message: "Password must be at least 8 characters long.",
    });
  }

  return errors;
};

const getFormattedDate = (askedDate) => {
  const currentDate = new Date();

  const timeDiff = currentDate.getTime() - askedDate.getTime();

  const secondsDiff = Math.floor(timeDiff / 1000);
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

  if (hoursDiff < 1) {
    if (minutesDiff < 1) {
      return `${secondsDiff} seconds ago`;
    } else {
      return `${minutesDiff} minutes ago`;
    }
  }

  if (hoursDiff < 24) {
    return `${hoursDiff} hours ago`;
  }

  // If the difference is within the same year, display month/day
  if (askedDate.getFullYear() === currentDate.getFullYear()) {
    return `${askedDate.toLocaleString("default", {
      month: "short",
      day: "2-digit",
    })} at ${askedDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    })}`;
  }

  // If the difference is more than a year, display month/day/year
  return `${askedDate.toLocaleString("default", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })} at ${askedDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  })}`;
};

const extractTagsAndSearchText = (input) => {
  const tagRegex = /\[([^\]]+)\]/g; // Regular expression to match text within square brackets
  let tags = [];
  let searchText = input
    .replace(tagRegex, (_, tag) => {
      tags.push(tag); // Extract tag and push it to the tags array
      return ""; // Replace the tag with an empty string
    })
    .trim(); // Trim any leading or trailing whitespace

  return {
    searchText: searchText,
    tags: tags,
  };
};

const filterQuestions = (questions, search = "") => {
  let copyQuestion = [...questions];

  if (search.length > 0) {
    const { searchText, tags } = extractTagsAndSearchText(search);

    let filterText = [];
    let filterTag = [];
    if (searchText.length > 0) {
      filterText = copyQuestion.filter((q) => {
        const titleWords = q.title.toLowerCase().split(" ");
        const textWords = q.text.toLowerCase().split(" ");
        for (const searchWord of searchText.split(" ")) {
          if (
            titleWords.includes(searchWord.toLowerCase()) ||
            textWords.includes(searchWord.toLowerCase())
          ) {
            return true;
          }
        }
      });
    }
    if (tags.length > 0) {
      filterTag = copyQuestion.filter((q) => {
        const questionTagNames = q.tags;
        for (const tag of tags) {
          if (questionTagNames.includes(tag.toLowerCase())) {
            return true;
          }
        }
      });
    }

    let joinedQuestions = filterText.concat(filterTag);

    return joinedQuestions;
  }

  return copyQuestion;
};

// Maybe this should be in the questionStore
const filterAndSortQuestions = async (order, search) => {
  try {
    const response = await axiosInstance.get(`/questions/getQuestion`, {
      params: {
        order: order,
        search: search,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error calling filter & search from backend");
  }
};

export {
  validatePassword,
  getFormattedDate,
  filterQuestions,
  filterAndSortQuestions,
};
