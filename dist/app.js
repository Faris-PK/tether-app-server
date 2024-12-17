"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketManager = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("../src/infrastructure/db/mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const AuthRoutes_1 = __importDefault(require("../src/presentation/routes/AuthRoutes"));
const AdminRoute_1 = __importDefault(require("../src/presentation/routes/AdminRoute"));
const UserRoute_1 = __importDefault(require("../src/presentation/routes/UserRoute"));
const PostRoutes_1 = __importDefault(require("../src/presentation/routes/PostRoutes"));
const productRoutes_1 = __importDefault(require("../src/presentation/routes/productRoutes"));
const storyRoutes_1 = __importDefault(require("../src/presentation/routes/storyRoutes"));
const LiveStreamRoutes_1 = __importDefault(require("../src/presentation/routes/LiveStreamRoutes"));
const ChatRoutes_1 = __importDefault(require("../src/presentation/routes/ChatRoutes"));
const socket_1 = __importDefault(require("./shared/utils/socket"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Initialize Socket
const socketManager = socket_1.default.getInstance();
exports.socketManager = socketManager;
socketManager.initialize(server);
// Middleware
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/auth', AuthRoutes_1.default);
app.use('/admin', AdminRoute_1.default);
app.use('/user', UserRoute_1.default);
app.use('/posts', PostRoutes_1.default);
app.use('/market', productRoutes_1.default);
app.use('/story', storyRoutes_1.default);
app.use('/livestream', LiveStreamRoutes_1.default);
app.use('/chat', ChatRoutes_1.default);
;
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    (0, mongoose_1.default)();
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map