// components/AnimalTablePagination.jsx
import React from "react";
import { Stack, Pagination } from "@mui/material";

const AnimalTablePagination = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <Stack direction="row" justifyContent="space-between" mt={2}>
      <span>Страница {currentPage} из {totalPages}</span>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
      />
    </Stack>
  );
};

export default AnimalTablePagination;
