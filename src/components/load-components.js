const components = [
  "./button/button.js",
  "./input/input.js",
  "./navbar/navbar.js",
  "./favorite-button/favorite-button.js",
  "./tooltip/tooltip.js",
  "./modal/modal.js",
  "./user-button/user-button.js",
  "./search/search.js",
  "./hero-section/hero-section.js",
  "./new-release/new-release.js",
  "./new-release/new-release-list.js",
  "./new-release/new-release-card.js",
  "./toast/toast.js",
  "./search-result/search-form.js",
  "./search-result/search-output.js",
  "./favorites/favorites.js",
  "./favorites/no-favorites.js",
  "./loader/loader.js",
  "./footer/footer.js",
  "./entrance/entrance.js",
];

components.forEach((component) => import(component));
