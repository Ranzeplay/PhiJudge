using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhiJudge.Server.Migrations
{
    public partial class PatchProblemModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccessToken",
                table: "Problems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ViewStatus",
                table: "Problems",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessToken",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "ViewStatus",
                table: "Problems");
        }
    }
}
