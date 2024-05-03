import { Notification, Ticket } from "@/models/models";
import { Button, Card, List } from "antd";

function UserExistingTickets({
  tickets,
  emails,
  onLogout,
}: {
  tickets: Ticket[];
  emails: Notification[];
  onLogout: () => void;
}) {
  return (
    <div className={"flex flex-col gap-y-2 w-3/4"}>
      <div>
        <div className={"justify-between flex flex-row"}>
          <div className={"font-semibold text-lg md:text-2xl"}>
            All your tickets
          </div>
          <Button
            shape="round"
            onClick={onLogout}
            style={{ marginRight: "20px", background: "navy", color: "white" }}
          >
            Logout
          </Button>
        </div>
        <List
          style={{ marginTop: 20 }}
          // loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={tickets}
          renderItem={(ticket) => (
            <List.Item>
              <Card
                key={ticket.id}
                title={"Ticket ID: " + ticket.id}
                // extra={<Text>${ticket.issueDescription}</Text>}
              >
                <div>
                  <strong>Issue</strong>: {ticket.issueDescription}
                </div>
                <div>
                  <strong>Status</strong>: {ticket.status}
                </div>
                {!!ticket.adminResponse && (
                  <div>
                    <strong>Admin Notes</strong>: {ticket.adminResponse}
                  </div>
                )}
                <div>
                  <strong>Updated At</strong>:{" "}
                  {new Date(ticket.updatedAt).toLocaleDateString("en-US", {
                    timeZone: "America/New_York",
                  })}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
      <div>
        <div className={"font-semibold text-lg md:text-2xl"}>Email Updates</div>
        {(emails === null || emails.length === 0) && (
          <div>No email updates</div>
        )}
        {emails !== null && emails.length > 0 && (
          <List
            style={{ marginTop: 20 }}
            // loading={loading}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={emails}
            renderItem={(email) => (
              <List.Item>
                <Card key={email.id} title={"Email ID: " + email.id}>
                  <div>
                    <strong>Status</strong>: {email.message}
                  </div>
                  <div>
                    <strong>Created At</strong>:{" "}
                    {new Date(email.createdAt).toLocaleDateString("en-US", {
                      timeZone: "America/New_York",
                    })}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}

export default UserExistingTickets;
