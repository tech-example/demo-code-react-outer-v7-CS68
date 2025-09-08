import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/install", "routes/install.tsx")
    ,
    route("/backends/db", "routes/backend/s-db.tsx"),
    route("/backends/package", "routes/backend/s-package.tsx"),
    route("/backends/server", "routes/backend/s-server.tsx"),
    route("/backends/positionController", "routes/backend/s-positionController.tsx"),
    route("/backends/teacherController", "routes/backend/s-teacherController.tsx"),
    route("/backends/errorHandler", "routes/backend/s-errorHandler.tsx"),
    route("/backends/uploads", "routes/backend/s-uploads.tsx"),
    route("/backends/svg", "routes/backend/s-default-svg.tsx"),
    route("/backends/index", "routes/backend/s-index.tsx"),
    route("/backends/positionRoutes", "routes/backend/s-positionRoutes.tsx"),
    route("/backends/teacherRoutes", "routes/backend/s-teacherRoutes.tsx")
    ,
    route("/fontends/Nav", "routes/fontend/s-nav.tsx"),
    route("/fontends/home", "routes/fontend/s-home.tsx"),
    route("/fontends/position", "routes/fontend/s-position.tsx"),
    route("/fontends/teacher", "routes/fontend/s-teacher.tsx"),
    route("/fontends/CustomSelect", "routes/fontend/s-customSelect.tsx"),
    route("/fontends/routes", "routes/fontend/s-routes.tsx"),
    route("/fontends/position-simple", "routes/fontend/s-position-simple.tsx"),
    route("/fontends/teacher-simple", "routes/fontend/s-teacher-simple.tsx")
    ,
    route("/database/create-database", "routes/database/s-create-database.tsx"),
    route("/database/create-table", "routes/database/s-create-table.tsx"),
    route("/database/insert-into", "routes/database/s-insert-into.tsx")
] satisfies RouteConfig;
