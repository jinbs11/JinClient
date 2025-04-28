using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Windows.Forms;

namespace client
{
    public partial class client : Form
    {
        private PrivateFontCollection pfc = new PrivateFontCollection();

        private void MakeRoundedPanel(Panel panel, int cornerRadius)
        {
            GraphicsPath path = new GraphicsPath();
            path.StartFigure();
            path.AddArc(new Rectangle(0, 0, cornerRadius, cornerRadius), 180, 90);
            path.AddArc(new Rectangle(panel.Width - cornerRadius, 0, cornerRadius, cornerRadius), 270, 90);
            path.AddArc(new Rectangle(panel.Width - cornerRadius, panel.Height - cornerRadius, cornerRadius, cornerRadius), 0, 90);
            path.AddArc(new Rectangle(0, panel.Height - cornerRadius, cornerRadius, cornerRadius), 90, 90);
            path.CloseFigure();
            panel.Region = new Region(path);
        }

        public client()
        {
            InitializeComponent();

            // TOP PANEL
            topPanel.Dock = DockStyle.Top;
            topPanel.BackColor = Color.FromArgb(150, Color.Black);
            topPanel.Height = 160;
            this.Controls.Add(topPanel);

            // CLIENT NAME
            pfc.AddFontFile("C:\\jinclient\\JinClient\\client\\client\\fonts\\Basketball.otf");

            clientName.Font = new Font(pfc.Families[0], 50F, FontStyle.Regular);
            clientName.Text = "JINCLIENT";
            clientName.AutoSize = true;
            clientName.Location = new Point((topPanel.Width - clientName.Width) / 2, (topPanel.Height - clientName.Height) / 2);
            topPanel.Controls.Add(clientName);

            // MOD MENU
            modMenuPanel.BackColor = Color.FromArgb(150, Color.Black);

            // MOD PANELS / TEXTS
            modText1.Location = new Point((modPanel1.Width - modText1.Width) / 2, (modPanel1.Height - modText1.Height) / 5);
            MakeRoundedPanel(modPanel1, 50);

        }

        private void playBTN_Click(object sender, EventArgs e)
        {

        }

        private void settingsBTN_Click(object sender, EventArgs e)
        {
            modMenuPanel.Visible = true;
        }

        private void modMenuCloseBTN_Click(object sender, EventArgs e)
        {
            modMenuPanel.Visible = false;
        }

        private void modPanel1_Click(object sender, EventArgs e)
        {
            modPanel1.BackColor = Color.Green;
        }

    }
}
