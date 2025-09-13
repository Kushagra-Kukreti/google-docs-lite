import { Card, CardContent, Typography, IconButton, Tooltip, Avatar, AvatarGroup } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function BoardCard({ board, onMenuOpen }) {
  return (
    <Card
      className="relative transition-all duration-200 rounded-2xl hover:shadow-xl hover:-translate-y-1 bg-white"
      sx={{ border: "1px solid #eaeaea" }}
    >
      <CardContent>
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <Typography variant="h6" className="font-semibold text-gray-800">
            {board.name}
          </Typography>
          <Tooltip title="More options">
            <IconButton
              onClick={(e) => onMenuOpen(e, board)}
              size="small"
              className="hover:bg-gray-100"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>

        {/* Members as Avatars */}
        <div>
          <Typography variant="subtitle2" className="text-gray-500 uppercase text-xs tracking-wide mb-1">
            Members
          </Typography>
          <div className="mt-2">
            {board.members?.length > 0 ? (
              <AvatarGroup max={5}>
                {board.members.map((m) => (
                  <Avatar
                    key={m.uid || m} // assuming member object has uid, fallback to string
                    alt={m.displayName || m} // displayName fallback to uid/email
                    src={m.photoURL || ""} // optional profile photo
                    sx={{ width: 32, height: 32, fontSize: 14 }}
                  >
                    {(m.displayName || m)[0].toUpperCase()}
                  </Avatar>
                ))}
              </AvatarGroup>
            ) : (
              <span className="text-gray-400 italic text-sm">No members yet</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
