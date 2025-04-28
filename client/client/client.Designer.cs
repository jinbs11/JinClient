using System;
using System.Drawing;
using System.Windows.Forms;

namespace client
{
    public partial class client : Form
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        private void InitializeComponent()
        {
            clientName = new Label();
            topPanel = new Panel();
            buttonHolder = new Panel();
            settingsBTN = new Button();
            playBTN = new Button();
            modMenuPanel = new Panel();
            modPanel1 = new Panel();
            modText1 = new Label();
            modMenuCloseBTN = new Button();
            topPanel.SuspendLayout();
            buttonHolder.SuspendLayout();
            modMenuPanel.SuspendLayout();
            modPanel1.SuspendLayout();
            SuspendLayout();
            // 
            // clientName
            // 
            clientName.Anchor = AnchorStyles.None;
            clientName.AutoSize = true;
            clientName.BackColor = Color.Transparent;
            clientName.Font = new Font("Segoe UI", 36F, FontStyle.Regular, GraphicsUnit.Point);
            clientName.ForeColor = SystemColors.Control;
            clientName.Location = new Point(452, 49);
            clientName.Name = "clientName";
            clientName.Size = new Size(245, 65);
            clientName.TabIndex = 0;
            clientName.Text = "JINCLIENT";
            // 
            // topPanel
            // 
            topPanel.BackColor = Color.Black;
            topPanel.Controls.Add(clientName);
            topPanel.Dock = DockStyle.Top;
            topPanel.Location = new Point(0, 0);
            topPanel.Name = "topPanel";
            topPanel.Size = new Size(1184, 163);
            topPanel.TabIndex = 1;
            // 
            // buttonHolder
            // 
            buttonHolder.Controls.Add(settingsBTN);
            buttonHolder.Controls.Add(playBTN);
            buttonHolder.Location = new Point(403, 352);
            buttonHolder.Name = "buttonHolder";
            buttonHolder.Size = new Size(329, 66);
            buttonHolder.TabIndex = 2;
            // 
            // settingsBTN
            // 
            settingsBTN.BackgroundImage = Properties.Resources.settingsIcon;
            settingsBTN.BackgroundImageLayout = ImageLayout.Stretch;
            settingsBTN.Cursor = Cursors.Hand;
            settingsBTN.Location = new Point(266, 3);
            settingsBTN.Name = "settingsBTN";
            settingsBTN.Size = new Size(60, 60);
            settingsBTN.TabIndex = 1;
            settingsBTN.UseVisualStyleBackColor = true;
            settingsBTN.Click += settingsBTN_Click;
            // 
            // playBTN
            // 
            playBTN.Cursor = Cursors.Hand;
            playBTN.Location = new Point(3, 3);
            playBTN.Name = "playBTN";
            playBTN.Size = new Size(257, 60);
            playBTN.TabIndex = 0;
            playBTN.Text = "PLAY";
            playBTN.UseVisualStyleBackColor = true;
            playBTN.Click += playBTN_Click;
            // 
            // modMenuPanel
            // 
            modMenuPanel.BackColor = Color.Black;
            modMenuPanel.Controls.Add(modPanel1);
            modMenuPanel.Controls.Add(modMenuCloseBTN);
            modMenuPanel.Dock = DockStyle.Bottom;
            modMenuPanel.Location = new Point(0, 169);
            modMenuPanel.Name = "modMenuPanel";
            modMenuPanel.Size = new Size(1184, 442);
            modMenuPanel.TabIndex = 3;
            modMenuPanel.Visible = false;
            // 
            // modPanel1
            // 
            modPanel1.BackColor = Color.Gray;
            modPanel1.Controls.Add(modText1);
            modPanel1.Cursor = Cursors.Hand;
            modPanel1.Location = new Point(12, 13);
            modPanel1.Name = "modPanel1";
            modPanel1.Size = new Size(200, 131);
            modPanel1.TabIndex = 1;
            modPanel1.Click += modPanel1_Click;
            // 
            // modText1
            // 
            modText1.AutoSize = true;
            modText1.BackColor = Color.Transparent;
            modText1.Font = new Font("Segoe UI Semibold", 26.25F, FontStyle.Bold, GraphicsUnit.Point);
            modText1.ForeColor = Color.Black;
            modText1.Location = new Point(32, 35);
            modText1.Name = "modText1";
            modText1.Size = new Size(121, 47);
            modText1.TabIndex = 0;
            modText1.Text = "Skytils";
            // 
            // modMenuCloseBTN
            // 
            modMenuCloseBTN.Location = new Point(1097, 13);
            modMenuCloseBTN.Name = "modMenuCloseBTN";
            modMenuCloseBTN.Size = new Size(75, 23);
            modMenuCloseBTN.TabIndex = 0;
            modMenuCloseBTN.Text = "Close";
            modMenuCloseBTN.UseVisualStyleBackColor = true;
            modMenuCloseBTN.Click += modMenuCloseBTN_Click;
            // 
            // client
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(64, 64, 64);
            BackgroundImageLayout = ImageLayout.Stretch;
            ClientSize = new Size(1184, 611);
            Controls.Add(modMenuPanel);
            Controls.Add(buttonHolder);
            Controls.Add(topPanel);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            Name = "client";
            Text = "JinClient";
            topPanel.ResumeLayout(false);
            topPanel.PerformLayout();
            buttonHolder.ResumeLayout(false);
            modMenuPanel.ResumeLayout(false);
            modPanel1.ResumeLayout(false);
            modPanel1.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private Label clientName;
        private Panel topPanel;
        private Panel buttonHolder;
        private Button settingsBTN;
        private Button playBTN;
        private Panel modMenuPanel;
        private Button modMenuCloseBTN;
        private Panel modPanel1;
        private Label modText1;
    }
}
