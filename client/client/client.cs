using System;
using System.Drawing;
using System.Drawing.Text;
using System.Windows.Forms;

namespace client
{
    public partial class client : Form
    {
        private PrivateFontCollection pfc = new PrivateFontCollection();

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
        }

        private void playBTN_Click(object sender, EventArgs e)
        {

        }

        private void settingsBTN_Click(object sender, EventArgs e)
        {

        }
    }
}
